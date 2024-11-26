export const cookie = {
  /*
   * Sets a cookie with a specified name, value, and expiration time in hours.
   * Parameters:
   * - name: The name of the cookie (string)
   * - value: The value to be stored in the cookie (string)
   * - hours: The duration in hours after which the cookie should expire (number)
   */
  set: ({
    name,
    value,
    hours,
  }: {
    name: string;
    value: string;
    hours: number;
  }) => {
    /*
     * Creates a new Date object to calculate the expiration date.
     * Sets the expiration time in milliseconds based on the hours provided.
     */
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + hours * 60 * 60 * 1000);

    /*
     * Formats the expiration date in UTC string format as required for cookies
     * and appends it to the cookie string as the "expires" attribute.
     */
    const expires = `; expires=${expireDate.toUTCString()}`;

    /*
     * Sets the cookie in the document with the specified name and value.
     * Includes the "expires" attribute for expiration and "path=/" to make it
     * accessible across the entire website.
     */
    document.cookie = `${name}=${value}${expires}; path=/`;

    /*
     * Retrieves the value of a cookie by its name.
     * Parameters:
     * - name: The name of the cookie to retrieve (string)
     * Returns:
     * - The cookie's value if found, or null if the cookie does not exist.
     */

    /*
     * Deletes a cookie by setting its expiration date to a past date.
     * Parameters:
     * - name: The name of the cookie to delete (string)
     */
  },

  get: (name: string): string | null => {
    /*
     * Constructs a regular expression to match the cookie name and capture its value.
     * `(^| )${name}=([^;]+)` explanation:
     * - (^| ): Matches the beginning of the string or a space (indicating start of a cookie).
     * - ${name}: Matches the exact cookie name.
     * - ([^;]+): Captures the value of the cookie (up until a semicolon or end of string).
     */

    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

    /*
     * If a match is found, returns the captured value (index 2 of the match).
     * If no match is found, returns null indicating the cookie does not exist.
     */
    return match ? match[2] : null;
  },

  remove: (name: string) => {
    /*
     * Sets the cookie with the specified name to an empty value and a past expiration date.
     * Setting "expires" to a date in the past forces the browser to delete the cookie.
     * The "path=/" ensures the cookie is deleted across the entire website.
     */
    document.cookie = `${name}=; Path/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },
};

export const generateGuid = () => {
  return (
    'id-' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
