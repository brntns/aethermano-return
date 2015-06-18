window.onload=function(){
	var defaultPresetArgs = {
		seed: (new Date()).toString(),
		color: 'greyscale',
		noiseFunction: 'perlin_classic', // value , simplex , perlin_classic , perlin_improved
		smoothing: 'quintic',
		scale: 35,
		size: 256,
		octaves: 1,
		persistence: .5,
		lacunarity: 2,
		gradientStart: 'ff0000',
		gradientEnd: '00ff00',
		independent: false,
		octaveFunction: 'none',
		customOctaveFunction: 'return n;',
		sumFunction: 'modular',
		customSumFunction: 'return n;',
		sineFrequencyCoeff: 1,
		modularAmplitude: 1.8
	};

	var canvas = document.getElementById('canvas');
	var context;

	// worker
	var noiseWorker = new Worker('js/noise.js');
	noiseWorker.addEventListener('message', function(e) {
	    switch(e.data.action) {
		    case 'updated': 
			context.putImageData(e.data.imageData, 0, 0);
			updateFinished(); 
			break;
		    case 'progress': 
			updateProgress(e.data.progress); 
			break;
		    case 'log': 
			console.log.apply(console, e.data.args); 
			break;
	    }
	}, false);
	noiseWorker.addEventListener('error', function(e) {
		console.log('noise error:', e);
	}, false);

	function startUpdate() {
		var imageData = context.createImageData(canvas.width, canvas.height);
		noiseWorker.postMessage({ 
			action: 'update',
			imageData: imageData,
			args: defaultPresetArgs 
		});
	}

	function resize() {
		canvas.width = 1000;//window.innerWidth;
		canvas.height = 1000;//window.innerHeight;
		context = canvas.getContext('2d');
	}

	window.onresize = function(event) {
	    resize();
	};
	// // init
	// var args = $.extend({}, presets.plain);
	// if(location.hash) $.extend(args, $.deparam(location.hash.substr(1), true));

	resize();
	startUpdate();
};