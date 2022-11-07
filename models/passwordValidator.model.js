const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8) // longueur mini 8
  .is()
  .max(100) // longueur maxi 100
  .has()
  .uppercase() // au moins une Capitale
  .has()
  .lowercase() // au moins une minuscule
  .has()
  .digits(2) //  au moins 2 chiffres
  .has()
  .not()
  .spaces() // pas d'espace
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // mot de passe interdit

module.exports = passwordSchema;
