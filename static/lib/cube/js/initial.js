/*

	TWIST NOTATION

	UPPERCASE = Clockwise to next 90 degree peg 顺时针至下一个90度桩
	lowercase = Anticlockwise to next 90 degree peg 逆时针至下一个90度销钉



	FACE & SLICE ROTATION COMMANDS 面和切片旋转命令

	F	Front
	S 	Standing (rotate according to Front Face's orientation) 站立（根据正面的方向旋转）
	B 	Back

	L 	Left
	M 	Middle (rotate according to Left Face's orientation)
	R 	Right

	U 	Up
	E 	Equator (rotate according to Up Face's orientation)
	D 	Down



	ENTIRE CUBE ROTATION COMMANDS 整个立方体旋转命令

	X   Rotate entire cube according to Right Face's orientation 根据右面的方向旋转整个立方体
	Y   Rotate entire cube according to Up Face's orientation
	Z   Rotate entire cube according to Front Face's orientation



	NOTATION REFERENCES

	http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
	http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation
*/


$(document).ready(function() {
	// -------------------- cubejs --------------------
	cubeTwoPhase = new Cube();
	Cube.initSolver();

	// -------------------- cuber --------------------
	var useLockedControls = true,
		controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;


	window.cubeGL = new ERNO.Cube({
		hideInvisibleFaces: true,
		controls: controls,
		renderer:  null,
		showCode:true,//学习点:是否显示Code,
		showType:"edge",//学习点:显示层
	});

	const container = document.getElementById( 'container' );
	container.appendChild( cubeGL.domElement );
	if (controls === ERNO.Locked) {
		const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
		cubeGL.object3D.lookAt(cubeGL.camera.position);
		cubeGL.rotation.x += fixedOrientation.x;
		cubeGL.rotation.y += fixedOrientation.y;
		cubeGL.rotation.z += fixedOrientation.z;
	}

	// The deviceMotion function provide some subtle mouse based motion
	// The effect can be used with the Freeform and Locked controls.
	// This could also integrate device orientation on mobile
	//deviceMotion功能提供了一些基于鼠标的精细运动。该效果可与“自由形式”和“锁定”控件一起使用。这也可以在移动设备上集成设备定向
	// var motion = deviceMotion( cubeGL, container );

	// motion.decay = 0.1; 				// The drag effect
	// motion.range.x = Math.PI * 0.06;	// The range of rotation
	// motion.range.y = Math.PI * 0.06;
	// motion.range.z = 0;
	// motion.paused = false;				// disables the effect

	cubeGL.twistDuration = 300;//旋转速度

	// cubeGL.twist('X');//学习点：旋转

	// cubeGL.shuffle(); //打乱
	// cubeGL.twist('d');//旋转
	// cubeGL.solve();//还原
})
