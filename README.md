# leaderboard

This project is a RESTful API Node.js leaderboards module designed for use in games and other projects.
It is a continuation of my work at Nationwide Children's Hospital, converting a simple
MySQL leaderboard into a MVC driven API using Sequelize for modeling.

This conversion began approximately on 01/14/19.


### Progress Report:

...

- 02/21/19: I finished the Semantic Ui front end implementation and Ajax calls using the reformatted Ejs. I also used Semantic's search plugin to provide game and username suggestions.  
  Using Semantic, I was able to provide front end form validation using their built-in form validation.
	TODO:
	- Provide a method to destroy all dummy data (regardless of delete_stamp) in the footer, possibly using Semantic's modal ui elements
  - Possibly display a validation error if no games exist
  - Hide search result if no results are found
  - Make layout more responsive for mobile
