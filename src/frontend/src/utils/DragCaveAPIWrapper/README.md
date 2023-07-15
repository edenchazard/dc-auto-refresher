# DragCave API Wrapper

A simple (and incomplete) wrapper written in TypeScript for the DragCave JSON API. It abstracts away a lot of the fluff.

## Format

All responses return in the following format:

```ts
{
  errors: [
    /* { code: 1, message: 'Example error message.' }  */
  ],
  data: {
    /* data */
  }
}
```

## Usage

This wrapper uses axios internally to make API calls. Errors occuring inside this will be thrown as an exception named DragCaveAPIError.

If an API call succeeds but DragCave itself returns errors, they'll be included in the error array and the data will be null. Otherwise, the error array will be empty and data will be populated with information from the API.

### Example

Example retrieving data for a specific dragon.

```ts
const apiKey = 'YOUR API KEY HERE';

// Instantiate wrapper with your private API key
const api = new DragCaveAPIWrapper(apiKey);

try {
  // Call the API
  const response = await api.view('v5QyV');

  // API gave us errors
  if (response.data === null) {
    console.log(response.errors);
    return;
  }
  // Success
  console.log(response.data);
} catch (err) {
  // API call error. This is usually axios.
  if (err instanceof DragCaveAPIError) {
    console.log('An error occurred contacting the API', err);
    return;
  }

  // Regular error
  console.log(err);
}
```

## Methods

See the [API documentation](https://dragcave/net/api.txt) for return data.

### view (code)

_Alias for /view_

Params:

- code: The dragon code

### massview (codes)

_Alias for /massview_

Params:

- codes: An array of dragon codes.

### info

_Alias for /info_

Params: None.
