// Error messages
const errors = {
  BADDRAGON: 'Error: The selected dragon may be an adult, frozen or dead.',
  BADCODE:
    "Error: The selected code isn't 5 characters or contains a character besides A-Z, a-z, 0-9.",
  ALREADYINLIST: 'Error: The code is already added.',
  CHECKINGAPI: 'Checking with TJ09...',
  BADCONNECTION: 'There was a problem contacting the server. Please try again.',
  NOINSTANCES: 'There are no dragons with 1 or more instances.',
  NODRAGONS: 'You must add a dragon first.',
};

// prevent modification
Object.freeze(errors);

export default errors;
