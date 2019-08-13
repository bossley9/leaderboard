# leaderboard

This project is a RESTful API Node.js leaderboards module designed for use in games and other projects.
It is a continuation of my work at Nationwide Children's Hospital, converting a simple
MySQL leaderboard into a MVC driven API using Sequelize for modeling.

This conversion began approximately on 01/14/19.

## Setup/Installation

1. Install package dependencies:
    ```
    npm i
    ```

2. Create a `KEYS.json` file in the root directory containing the following information:
    ```json
    {
      "host": "localhostOrHostIPHere",
      "username": "MySQLUserNameHere",
      "password": "MySQLPasswordHere",
      "database": "dbNameHere"
    }
    ```
    This file is ignored by the git repository on commit.

3. Make sure the MySQL user specified in the `KEYS.json` file exists and has been granted database creation privileges:
    ```sql
    GRANT ALL PRIVILEGES ON *.* TO ‘MySQLUserNameHere'@'localhostOrHostIPHere' IDENTIFIED BY 'MySQLPasswordHere';
    FLUSH PRIVILEGES;
    ```

## Progress Report:

...

- 02/21/19: I finished the Semantic Ui front end implementation and Ajax calls using the reformatted Ejs. I also used Semantic's search plugin to provide game and username suggestions.  
  Using Semantic, I was able to provide front end form validation using their built-in form validation.

  TODO:

  - Provide a method to destroy all dummy data (regardless of delete_stamp) in the footer, possibly using Semantic's modal ui elements
  - Possibly display a validation error if no games exist
  - Hide search result if no results are found
  - Make layout more responsive for mobile

- 02/25/19: I hid Semantic's default popup if no search results are found by digging in the script file (the documentation doesn't mention the function properties).
  I was also able to add custom validation functions for each field, tweaking forms to display an error if no games exist.
  I additionally added a Semantic modal for fun to be able to hard delete data from the database (this would never be implemented in a real API but it lets me practice
  routing and additionally makes it easier for me to test data regardless). I still have to implement the functionality.

  TODO:

  - Finish "hard delete" modal route/ajax call
  - Make layout more responsive for mobile

- 02/28/19: I completed the hard delete route using Sequelize. I search around a bit and use manual SQL queries to get Sequelize to delete everything
  because Sequelize has trouble truncating tables with foreign keys. I also changed a bit of coloring and moved around a few ui elements for ease of access.
  I spent a lot of time trying to customize some ui elements with no success. I also took the liberty of improving the site's accessibility.
  After making the API more mobile-friendly, I started looking into Bamboo.

  TODO:

  - work on accessibility (modal focus: https://www.w3.org/WAI/test-evaluate/preliminary/#title)

- 03/04/19: I worked solely on accessibility today, sacrificing visuals for improved accessibility. It should
  always be that accessibility is above visual effects.

  TODO:

  - Lock tabindex between modal buttons when modal is open
  - Make tabbing compatible with Safari's _option + tab_ tabbing
  - Finish javascript enabled note

- 03/07/19: Today I fixed all font sizes to be larger for better readability, as well as finishing a custom overlay to prompt the user to enable javascript.
  I then began work on improving tab indexing. I was able to lock tab indices within the modal when open.
  I spent a very long time trying to attempt to fix the tabbing for the Select element.
  This was fixed using Semantic's onHide and onShow events, which are not specified clearly and plainly in their documentation.
  I also decided not to try to account for Safari's _option + tab_ tabbing because it is a specific browser issue and can be changed in Safari's settings.
  Then I fixed up the html meta tags and polished any last details (sizing and colors).
  I noticed that the user and score were being submitted twice but the second pair was being disregarded by Sequelize (due to unique constraints). I fixed this error
  by checking with a boolean variable whether the form had already been submitted. This boolean value is switched once the Ajax call has finished in the success() function.
  I had to try a slightly different approach for the game input form, since the form contained two buttons. When the ENTER key is pressed, neither buttons call "click" events and
  an exception case was needed to ensure the form would not lock.

- 07/22/19: After a long hiatus, I fixed security vulnerabilities and updated to ES6+. I first had to make sure everything was running properly before transitioning.