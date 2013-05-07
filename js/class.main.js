var CGMain = CGSGScene.extend(
    {
        /**
         * Initialize.
         * @param canvas {Object} canvas
         */
        initialize: function (canvas) {
            this._super(canvas);
            this.initializeCanvas();
            this.createScene();
            this.startPlaying();
        },

        /**
         * Initialize canvas.
         */
        initializeCanvas: function () {
            //resize the canvas to fulfill the viewport
            this.viewDimension = cgsgGetRealViewportDimension();
            this.setCanvasDimension(this.viewDimension);
        },

        /**
         * Play area !!
         */
        createScene: function () {
            var demo = new CGSGNodeSquare(0, 0, 800, 800);
            demo.color = "#D8D8D8";
            this.sceneGraph.addNode(demo);

            // Proxy !!
            var instance = this;

            // Indeterminate
            var pbDemo1 = new ProgressBar(this.sceneGraph, 10, 10, this.context, 300, 10, true, 100, "Indeterminate loading #%");
            pbDemo1.setProgressColor('red');
            demo.addChild(pbDemo1);

            // Progress
            this.pbDemo2 = new ProgressBar(this.sceneGraph, 10, 50, this.context, 300, 10, false, 100, "Normal loading #%");
            demo.addChild(this.pbDemo2);

            this.labelDemo2 = new CGSGNodeText(this.pbDemo2.width + 20, this.pbDemo2.position.y - 3, "Progress : %");
            this.labelDemo2.setSize(10);
            demo.addChild(this.labelDemo2);

            setInterval(
                function() {
                    if(instance.pbDemo2.value === 100) {
                        instance.pbDemo2.setValue(0);
                    } else {
                        instance.pbDemo2.setValue(instance.pbDemo2.value + 1);
                    }
                }, 100);

            this.pbDemo2.onProgressChange = function (event) {
                instance.labelDemo2.setText("Progress event (value = " + event.value + "%)")
            };

            // Random
            this.pbDemo3 = new ProgressBar(this.sceneGraph, 10, 90, this.context, 300, 10, false, 100, "Random Progress Bar #%", 'black', 'white', '#FA58F4');
            this.pbDemo3.setBackgroundColor('yellow');
            demo.addChild(this.pbDemo3);
            setInterval(
                function() {
                    instance.pbDemo3.setValue(Math.round(Math.random() * 100));
                }, 1000);

            // Without label
            var pbDemo4 = new ProgressBar(this.sceneGraph, 10, 130, this.context, 300, 10, true, 100);
            demo.addChild(pbDemo4);

            // Custom size
            this.pbDemo5 = new ProgressBar(this.sceneGraph, 10, 170, this.context, 300, 50, false, 100, "#%");
            this.pbDemo5.setTextSize(35);
            demo.addChild(this.pbDemo5);

            setInterval(
                function() {
                    if(instance.pbDemo5.value === 100) {
                        instance.pbDemo5.setValue(0);
                    } else {
                        instance.pbDemo5.setValue(instance.pbDemo5.value + 1);
                    }
                }, 100);
        }



    }
);