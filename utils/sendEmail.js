import dotenv from "dotenv"; 
const { MailtrapClient } = require("mailtrap");

dotenv.config({ path: "config/config.env" });
 

const sendEmail = async (options) => {


 
  const ENDPOINT = "https://send.api.mailtrap.io/";

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: process.env.MAILTRAP_TOKEN });

  const sender = {   email: "noreply@gamrslog.online" };

  await client.send({
    from: sender,
    to: [{ email: options.email }],
    subject: options.subject,
    text: options.message,
    html: options.html // Ensure the HTML content is passed
  }) 


   
}

export default sendEmail;