// ============================================================================
//  Games API — replaces katip.py (feedback) and umay.py (high scores)
//  Endpoints are kept compatible with the previous Python apps so existing
//  game clients can be redirected here with minimal changes.
// ============================================================================
const express = require('express');
const { query, queryOne } = require('../db');

const router = express.Router();

/* -------- POST /api/games/feedback  (was katip.py) -------- */
router.post('/feedback', async (req, res) => {
    const body = req.body || {};
    const message = String(body.feedback_message || '').trim();
    const language = String(body.feedback_language || '');
    const gameId = String(body.feedback_game_id || '');

    if (language !== '0' && language !== '1') {
        return res.json({ success: 0, message: 'Language is not set!' });
    }

    const t = (en, tr) => (language === '1' ? tr : en);

    if (message.length === 0) {
        return res.json({ success: 0, message: t('Message is empty', 'Mesaj boş!') });
    }
    if (message.length >= 512) {
        return res.json({ success: 0, message: t('Message is too long. Should be 512 chars max!', 'İleti çok uzun. En fazla 512 karakter olmalı!') });
    }

    try {
        await query('INSERT INTO game_feedbacks (game_id, message) VALUES (?, ?)', [gameId, message]);
        return res.json({
            success: 1,
            message: t(
                'We successfully received your feedback and recorded to our database. Thank You!',
                'Geribildiriminizi aldık ve başarıyla veritabanımıza kaydettik!'
            ),
        });
    } catch (err) {
        console.error('Feedback DB error:', err.message);
        return res.json({
            success: 0,
            message: t(
                "Couldn't record the feedback to our database! Please try again.",
                'Geribildiriminizi veritabanımıza kaydedemedik! Lütfen tekrar deneyiniz.'
            ),
        });
    }
});

/* -------- POST /api/games/high-score  (was umay.py) -------- */
router.post('/high-score', async (req, res) => {
    const body = req.body || {};
    const playerName = String(body.score_player_name || '').trim();
    const language = String(body.score_language || '');
    const gameId = String(body.score_game_id || '');
    const playerScore = parseInt(body.score_player_score, 10) || 0;

    if (language !== '0' && language !== '1') {
        return res.json({ success: 0, message: 'Language is not set!' });
    }

    const t = (en, tr) => (language === '1' ? tr : en);

    if (playerName.length === 0) {
        return res.json({ success: 0, message: t('Player name is empty!', 'Oyuncu ismi boş!') });
    }
    if (playerName.length > 24) {
        return res.json({ success: 0, message: t('Player name is too long. Should be 24 chars max!', 'Oyuncu ismi çok uzun. En fazla 24 karakter olmalı!') });
    }

    try {
        const existing = await queryOne(
            'SELECT high_score FROM game_high_scores WHERE player_name = ? AND game_id = ?',
            [playerName, gameId]
        );

        let finalScore = playerScore;

        if (!existing) {
            await query(
                'INSERT INTO game_high_scores (game_id, player_name, high_score) VALUES (?, ?, ?)',
                [gameId, playerName, playerScore]
            );
        } else {
            const previousScore = parseInt(existing.high_score, 10) || 0;
            if (playerScore > previousScore) {
                await query(
                    'UPDATE game_high_scores SET high_score = ? WHERE game_id = ? AND player_name = ?',
                    [playerScore, gameId, playerName]
                );
                finalScore = playerScore;
            } else {
                finalScore = previousScore;
            }
        }

        // Rank: 1-based position of this player among same-game scores (higher score = better)
        const stats = await queryOne(
            `SELECT
                 (SELECT COUNT(*) FROM game_high_scores WHERE game_id = ?) AS total_players,
                 (SELECT COUNT(*) FROM game_high_scores
                    WHERE game_id = ?
                    AND high_score >= (
                        SELECT high_score FROM game_high_scores
                        WHERE player_name = ? AND game_id = ?
                    )) AS player_position`,
            [gameId, gameId, playerName, gameId]
        );

        return res.json({
            success: 1,
            response: 'OK',
            score: String(finalScore),
            ranking: `${stats.player_position} / ${stats.total_players}`,
        });
    } catch (err) {
        console.error('High-score DB error:', err.message);
        return res.json({
            success: 0,
            message: t(
                "Couldn't record the high score to our database! Please try again.",
                'Skorunuzu veritabanımıza kaydedemedik! Lütfen tekrar deneyiniz.'
            ),
        });
    }
});

/* -------- GET /api/games/leaderboard?gameId=...  -------- */
router.get('/leaderboard', async (req, res) => {
    const gameId = String(req.query.gameId || '');
    if (!gameId) return res.status(400).json({ success: false, message: 'gameId required' });
    try {
        const rows = await query(
            'SELECT player_name, high_score, updated_at FROM game_high_scores WHERE game_id = ? ORDER BY high_score DESC LIMIT 100',
            [gameId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
