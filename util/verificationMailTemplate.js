const verificationMailTemplate = (VerfiedLink) => {
  return `
    <p>Congratulations! You're almost set tafdasdfsdo start using Perky Beans- Cafe Web</p>
    <p>Just click the button below to validate your email address</p>
    <a href="${VerfiedLink}" style="padding: 5px;background-color: brown;color: white;font-size: 22px;text-decoration: none;padding: 6px 15px;"}>Verify Email</a>`;
};
module.exports = verificationMailTemplate;
