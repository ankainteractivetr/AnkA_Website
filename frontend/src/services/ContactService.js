/** Sends the contact form to the API (POST /api/contact); resolves to the API's thank-you message in the visitor's language. */
export class ContactService
{
  #http;

  constructor(httpClient)
  {
    this.#http = httpClient;
  }

  async send(request)
  {
    const { message } = await this.#http.post('/contact', request.toJSON());
    return message;
  }
}
