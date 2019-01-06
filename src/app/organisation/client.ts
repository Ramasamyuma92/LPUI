export class Client {
	constructor(
    public clientName: string,
    public address1: string,
    public address2: string,
    public city: string,
    public state: string,
    public zip: string,
    public country: string,
    public discount: number,
    public primaryContactName: string,
    public primaryContactEmail: string,
    public primaryContactPhone1: string,
    public primaryContactPhone2: string,
    public secondaryContactName: string,
    public secondaryContactEmail: string,
    public secondaryContactPhone1: string,
    public secondaryContactPhone2: string,
    public status: string
  ) {  }
}
