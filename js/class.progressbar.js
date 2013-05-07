/**
 * Represent the progress bar component
 *
 * @class ProgressBar
 * @constructor
 * @extends {Object} CGSGNode
 * @param scene {Object} the scene
 * @param x {Number} the x position
 * @param y {Number} the y position
 * @param canvas {Object} the Canvas
 * @param width {Number} the progress bar width
 * @param indeterminate {Boolean} if the progress bar is indeterminate
 * @param max {Number} the max value for progress bar (example : 100% = 100)
 * @param label {String} the label for loading message (example : "Loading #%" = Loading 10%), can be undefined
 * @author Corentin Azelart (corentin@azelart.fr)
 */
var ProgressBar = CGSGNode.extend(
    {

        initialize: function (scene, x, y, canvas, width, height, indeterminate, max, label) {
            this._super(x, y, 10, width);

            // ClassType
            this.classType = "ProgressBar";

            // Set scene
            this.scene = scene;

            // Set dimensions.
            this.width = width;
            this.height = height;

            // Set label
            this.labelProgress = label;

            // General configuration
            this.borderColor = 'black';
            this.backgroundColor = 'white';
            this.progressColor = '#0080FF';
            this.textSize = 6;

            // Settings
            this.value = this.min = 0;
            this.max = max;

            this.indeterminate = indeterminate;

            /**
             * Callback on progress bar was changed
             * @optional
             * @property onProgressChange
             * @type {Function}
             */
            this.onProgressChange = null;

            // Start drawing...
            this.drawProgressBar();

            // Set function parameters
            this.setIndeterminate(indeterminate);

            // Set start value
            this.setValue(this.value);
        },

        /**
         * Set border color.
         * @method setBorderColor
         * @public
         * @param borderColor {String} is the border color
         */
        setBorderColor : function(borderColor) {
            this.borderColor = this.mainSquare.lineColor = borderColor;
        },

        /**
         * Set the background color.
         * @method setBackgroundColor
         * @public
         * @param backgroundColor {String} is the background color
         */
        setBackgroundColor : function(backgroundColor) {
            this.backgroundColor = this.mainSquare.color = backgroundColor;
        },

        /**
         * Set the progress color.
         * @method setProgressColor
         * @public
         * @param progressColor {String} is the progress bar color
         */
        setProgressColor : function(progressColor) {
            this.progressColor = this.progressContainer.color = progressColor;
        },

        /**
         * Set the text size.
         * @method setTextSize
         * @public
         * @param textSize {Number} is the text size
         */
        setTextSize : function(textSize) {
            this.textSize = textSize;
            this.label.setSize(this.textSize);
        },

        /**
         * Set the progress value.
         * @method setValue
         * @public
         * @param value {Number} is the progress value.
         */
        setValue : function(value) {
            // Only if indeterminate mode is not enabled !
            if(!this.indeterminate) {

                // We assure than we are in range...
                if(value < this.min) {
                    this.value = this.min;
                } else if (value > this.max) {
                    this.value = this.max;
                } else {
                    this.value = value;
                }

                // We move the progress bar...
                var newSeek = (this.width / this.max) * this.value;
                if(newSeek <= 0) {
                    newSeek = 2;
                }
                this.progressContainer.resizeTo(newSeek - 2, this.progressContainer.height);

                // Update text
                this.label.setText(this.labelProgress.replace("#", this.value));

                // Progress Change event...
                if(cgsgExist(this.onProgressChange)) {
                    this.onProgressChange({value: this.value});
                }
            }
        },

        /**
         * Return the progress bar value.
         * @method getValue
         * @public
         * @return {Number} the progress bar value.
         */
        getValue : function() {
            return this.value;
        },

        /**
         * Set progressbar in indeterminate mode.
         * @method setIndeterminate
         * @public
         * @param indeterminate {Boolean} if indeterminate mode must be enabled.
         */
        setIndeterminate : function(indeterminate) {
            this.indeterminate = indeterminate;

            if(this.indeterminate) {
                this.progressContainer.resizeTo(20, this.progressContainer.height);
                this.playIndeterminate();
            }
        },

        /**
         * Play indeterminate function.
         * @method playIndeterminate
         * @private
         */
        playIndeterminate : function() {
            // Proxy current instance
            var currentInstance = this;

            // Animate.
            this.scene.animate(this.progressContainer, "position.x", 30, 1, this.width - this.progressContainer.dimension.width - 1, "linear", 0, true);
            this.scene.getTimeline(this.progressContainer, "position.x").onAnimationEnd = function (event) {
                currentInstance.playIndeterminate();
            }
        },

        /**
         * Draw the progress bar.
         * @method drawProgressBar
         * @private
         */
        drawProgressBar : function() {
            // Main container
            this.mainSquare = new CGSGNodeSquare(0, 0, this.width, this.height);
            this.mainSquare.lineWidth = 1;
            this.mainSquare.lineColor = this.borderColor;
            this.mainSquare.color = this.backgroundColor;

            // Progress container
            this.progressContainer = new CGSGNodeSquare(1, 1, 0, this.height - 2);
            this.progressContainer.color = this.progressColor;

            this.addChild(this.mainSquare);
            this.addChild(this.progressContainer);

            // Label
            if(this.labelProgress !== undefined) {
                if(this.indeterminate) {
                    this.label = new CGSGNodeText(2, 0, this.labelProgress.replace("#", "...").replace("%", ""));
                } else {
                    this.label = new CGSGNodeText(2, 0, this.labelProgress);
                }
                this.label.setSize(this.textSize);
                this.addChild(this.label);
            }
        }
    }
);