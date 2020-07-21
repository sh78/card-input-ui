import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiFormControl-root": {},
  },
  submit: {
    fontSize: "1.21em",
    margin: "0 auto",
  }
}));

function PaymentForm() {
  const classes = useStyles();

  // State: current value of fields
  const starterFields: { [key: string]: string } = {
    cardName: "",
    cardNumber: "",
    cardExpiration: "",
    cardCVV: "",
  };
  const [fields, setFields] = useState(starterFields);

  // State: map of which field names have an error
  const starterErrors: { [key: string]: Boolean } = {
    cardName: false,
    cardNumber: false,
    cardExpiration: false,
    cardCVV: false,
  };
  const [errorObj, setErrorObj] = useState(starterErrors);

  // Each property is a function that looks at the current field State and
  // decides if its own field is valid. This is to handle validation
  // dependencies; namely, the CVV variation between Amex and Visa.
  const validators: { [key: string]: Function } = {
    cardName: (val: string) => {
      // "One alpha character followed by one or more alpha, comma, period,
      // single quote, hypen."
      // This is lenient; not sure how important the name is for a merchant
      // processor. privacy.com, for example, allows "any" name.
      // FIXME: support people who have other characters in their name, like
      // André.
      const pattern = /^[a-z][a-z ,.'-]+$/i;
      return pattern.test(val);
    },
    isVisa: (val: string) => {
      // Any 16 digits starting with 4
      const visaPattern = /^4\d{15}$/;
      return visaPattern.test(val);
    },
    isAmex: (val: string) => {
      // Any 16 digits starting with 4
      const amexPattern = /^(34|37)\d{13}$/;
      return amexPattern.test(val);
    },
    cardNumber: (val: string) => {
      const self = validators;
      const amex = self.isAmex(val);
      const visa = self.isVisa(val);
      return visa || amex;
    },
    cardExpiration: (val: string) => {
      // FIXME: better to do this with a normalization library like Moment.js
      const isFourDigits = !!val.match(/^\d{4}$/);
      if (isFourDigits) {
        // Year of expiry, assume it's ok to prefix the current century
        const ExpYear = parseInt(`20${val.slice(2, 4)}`);
        // Two digits representing month
        const ExpMonth = parseInt(val.slice(0, 2), 10);
        // Make a Date, the first day of the expiry month
        const ExpDate = new Date(ExpYear, ExpMonth - 1);
        // Current date
        const nowDate = new Date();

        // Compare
        return ExpDate > nowDate;
      }
      return false;
    },
    cardCVV: (val: string) => {
      const self = validators;

      // This looks ok, 3 or 4 digits, let's think some more
      const couldBe = !!val.match(/^\d{3,4}$/);
      // Current card number value in State
      const stateCardNumber = self.cardNumber(fields.cardNumber);

      // If we have a 3 or 4 digit value, but no card number; don't yell at
      // anyone just yet.
      if (couldBe && stateCardNumber.length === 0) return true;

      // If there is a value for the card number right now; does this CVV align
      // with the inferred bank?
      const visa = self.isVisa(fields.cardNumber);
      if (visa && val.length === 3) return true;

      const amex = self.isAmex(fields.cardNumber);
      if (amex && val.length === 4) return true;

      return false;
    },
  };

  const validateAnInput = (name: string, value: string) => {
    let isValid = false;
    // Make sure this is a String, and not a string, so we can look up the
    // index
    const nameString = name.toString();
    if (validators[nameString](value)) {
      isValid = true;
    }

    return isValid;
  };

  // TODO: State: is the form submit in progress right now?
  // const [ loading, setLoading ] = useState(false);

  // State: check if it's ok to submit the whole form
  const [allowSubmit, setAllowSubmit] = useState(false);
  useEffect(() => {
    const allFieldsValid = () => {
      // Loop through fields in state and check if they have been filled out and
      // don't have errors
      for (const prop in fields) {
        const propString = prop.toString();
        if (fields[propString].length === 0 || errorObj[propString] === true) {
          return false;
        }
      }
      return true;
    };

    setAllowSubmit(allFieldsValid);
  }, [errorObj, fields]);

  // Each change to a single field
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const { name, value } = event.target as HTMLInputElement;

    // State: update the field value
    setFields((prevState) => ({ ...prevState, [name]: value }));

    // Get result of validation (boolean)
    const isInvalid = !validateAnInput(name, value.toString());

    // Update error state, which will inform the view
    setErrorObj((prevState) => ({ ...prevState, [name]: isInvalid }));
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
      <Grid justify="center" container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            Enter your credit card information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="card-name"
            name="cardName"
            fullWidth
            label="Full name"
            variant="outlined"
            required
            value={fields["cardName"]}
            error={!!errorObj.cardName}
            helperText={
              errorObj.cardName ? "Please enter your full name" : null
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="cardNumber"
            name="cardNumber"
            fullWidth
            label="Card number"
            variant="outlined"
            required
            value={fields["cardNumber"]}
            error={!!errorObj.cardNumber}
            helperText={
              errorObj.cardNumber ? "Enter a valid 16 digit card number" : null
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="card-expiration"
            name="cardExpiration"
            fullWidth
            label="Expires"
            variant="outlined"
            required
            value={fields["cardExpiration"]}
            error={!!errorObj.cardExpiration}
            helperText={
              errorObj.cardExpiration ? "Enter a valid expiration date" : null
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="card-cvv"
            name="cardCVV"
            fullWidth
            label="CVV2"
            variant="outlined"
            value={fields["cardCVV"]}
            required
            error={!!errorObj.cardCVV}
            helperText={
              errorObj.cardCVV
                ? "Last group of digits on the signature strip"
                : null
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid
          item
        >
          <Button
            fullWidth={true}
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!allowSubmit}
          >
            Pay Now
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default PaymentForm;
