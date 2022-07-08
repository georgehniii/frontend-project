# Rain Crow frontend-project
If the map is not working try to minimize your screen and then expand it back it will resize the map this is the temperary work around for now. If it still does not work then to many people have used the app and locked the API key. I will be working on limiting the request calls so that it will work again after a minute or two if it is exceeded.

My front end project. Its a weather app.

You can check it out at this link: https://georgehniii-rain-crow.netlify.app/

The radar section is a work in progress. It currently dosnt use an actual radar but does use weather information to give you an idea of how the weather is. The map may not load yet. Will get back to it soon.

Will be updating the code to ES6 in future and cleaning it up even more.

Its exciting in its own way to run into issues or get an email saying you exceeded your acounts api call requests per min. I did not expect to reach the cap of the map tiler service for their free acount but I have. It also did not take that many people. I will build in a cap to the amount of calls as to not crash it and rewrite the code to lower the amount of requests. 
