# linkedin-oauth-helper
This is a helper script to handle LinkedIn OAuth. For a detailed, step-by-step guide, please refer to this [article I wrote](https://www.azaytek.com/how-to-publish-to-linkedin-via-api/).
If you found this repository useful, please consider giving it a star ⭐ on GitHub. This helps to promote the project and show your support.

## How it works
The script check if there's a valid access token in a local json file. If it exists, it uses it to do an API call to get the corresponding user ID. If the API call is successful, it prints both: the user access token & ID &. If it fails, it starts the OAuth process by executing the following steps:
- It builds the authorization url 
- It launches the default user's browser and redirect it to the previously built authorization url to handle the authorization process.  
- The user will have to log in &/or proceed by allowing access.
- Once user proceeds, the script will handle the callback where authorization code is sent (using a minimalist express server). 
- Once the script gets the authorization code, it uses it to do 2 API requests: get an access token and the corresponding user ID.
Once finished, it saves the access token to a local file, and prints the result to the browser & the console.

## Requirements
Before using this script, make sure to copy the ```env.example``` file to ```.env```.
Once you've done that, you need to create a LinkedIn app and get the client id and secret, and then update the ```.env``` file with these variables.
You can do it here: https://www.linkedin.com/developer/apps

Note: please make sure to have the same ```REDIRECT_URI``` value configured in both LinkedIn app's page and this script

## Installation

Execute the following command to install the required dependencies:
``` npm install ```

## Usage
Simply execute the following command:
``` node index.js ```

## Output
Once the script is finished, you should see the following output:
### Console:

```
{
linkedInId: '***.....',
linkedInAccessToken: '*************************.....'
}
```

### Browser:
```
Your can now close this window. :-)
linkedInId	linkedInAccessToken
***.....  	*************************.....
```
## Customization:
- You can customize the redirect url in the ```.env``` file
- You can customize the file where the access token is saved in the ```.env``` file
