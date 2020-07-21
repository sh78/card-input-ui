import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    "& .MuiFormControl-root": {
      marginBottom: theme.spacing(2),
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// This is rather lenient; unsure of how important the name field is for the
// merchant processor. For now we'll say one or more or any alpha, comma,
// period, or hyphen.
// FIXME: support people who have other characters in their name, like André
// Also - are one word names valid in credit card land? Cher? Bono?
const validNameRE = /^[a-z ,.'-]+$/i;

const validateInput = (name: string, value: string) => {
  let isValid = false;
  if (validNameRE.test(value)) {
    isValid = true;
  }

  return isValid;
};

function PaymentForm() {
  const classes = useStyles();

  // State: map of which field names have an error
  const [ errorObj, setErrorObj ] = useState({
    'cardName': false
  });
  // TODO: State: is the form submit in progress right now?
  // const [ loading, setLoading ] = useState(false);

  // Changes to individual inputs
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const { name, value } = event.target as HTMLInputElement;

    // Get result of validation (boolean)
    const isInvalid = !validateInput(name, value.toString());
    // Replace value of field name in error our state object with the result
    setErrorObj(prevState => ({ ...prevState, [name]: isInvalid }))
  };

  // Submit of the form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    // TODO: Cue the loading effect
    // this.setState({ loading, true });

    // TODO: Validation logic
    // Decide on allowing submit, update state to inform the view
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography component="h1" variant="h4" align="center">
        Enter your credit card information
      </Typography>
      <TextField
        id="card-name"
        name="cardName"
        fullWidth
        label="Full name"
        variant="outlined"
        required
        error={errorObj.cardName}
        helperText={errorObj.cardName ? 'Please enter your full name' : null}
        onChange={handleChange}
      />
      <TextField
        id="card-number"
        name="card-number"
        fullWidth
        label="Card number"
        variant="outlined"
        required
      />
      <TextField
        id="card-expiration"
        name="card-expiration"
        fullWidth
        label="Expiration Date"
        variant="outlined"
        required
      />
      <TextField
        id="card-cvv"
        name="card-cvv"
        fullWidth
        label="CVV2"
        helperText="Last three digits on signature strip"
        variant="outlined"
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled
      >
        Pay Now
      </Button>
    </form>
  );
}

export default PaymentForm;
