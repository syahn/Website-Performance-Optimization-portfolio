
## Website Performance Optimization portfolio project

This project is to optimize this online portfolio for speed.

### Get started

1. Download or clone the repository
2. Install dependecis for setting up the task runner, Gulp. Type following command in your terminal. It will set up all required dependencies for your development and production by package.json files
 ```
 npm install
 ```

3. Next, type following command to set up automated workflow using the Grunt.
 ```
 grunt
 ```

4. Cool! Everything for starting your work is set up. Just make changes in the src directory, then the changes automatically applied to files in the dist directory.
5. Run the app locally in simple way. Move to dist directory to use optimized version of the app, and type following command.
 ```
 python -m SimpleHTTPServer
 ```

  * Now, you can access the app via "localhost:8000" (This port number can be varied, pay attention to the terminal)
6. To find out the PageSpeedInsight score, type following command.
```
gulp psi
```
7. Now you can check psi score of the app



### What I've done for it.

#### Part 1: Optimize PageSpeed Insights score for index.html

1. compress all images and resize pizzria.jpg
2. move font link into css with @import
3. load performatter script asyncronously and defer GA script
4. put deferred GA script at the bottom of body
5. give media query to print.css


#### Part 2: Optimize Frames per Second in pizza.html

1. Refactor resizePizzas function with deleting determineDx
2. Refactor updatePositions function
3. Give backface-visibility: hidden property to class mover
4. Resize the number of moving pizzas rendered above the screen
