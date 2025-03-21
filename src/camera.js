import * as THREE from 'three';


export function createCamera(gameWindow) {

    const DEG2RAD = Math.PI / 180.0;

    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 2;
    const MAX_CAMERA_RADIUS = 10;
    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 90;
    const ROTATION_SENSITIVITY = 0.5;
    const ZOOM_SENSITIVITY = 0.02;
    const PAN_SENSITIVITY = -0.01;

    const Y_AXIS = new THREE.Vector3(0, 1, 0);

    const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
    let cameraRadius = 4;
    let cameraAzimuth = 0;
    let cameraElevation = 0;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    // let prevMouseX = 0;
    // let prevMouseY = 0;
    updateCameraPosition();

    function onMouseDown(event) {
        switch (event.button) {
            case LEFT_MOUSE_BUTTON: isLeftMouseDown = true; break;
            case RIGHT_MOUSE_BUTTON: isRightMouseDown = true; break;
            case MIDDLE_MOUSE_BUTTON: isMiddleMouseDown = true; break;
        }
    }

    function onMouseUp(event) {
        switch (event.button) {
            case LEFT_MOUSE_BUTTON: isLeftMouseDown = false; break;
            case RIGHT_MOUSE_BUTTON: isRightMouseDown = false; break;
            case MIDDLE_MOUSE_BUTTON: isMiddleMouseDown = false; break;
        }
    }

    function onMouseMove(event) {
        // rotation
        if (isLeftMouseDown) {
            cameraAzimuth += event.movementX * -ROTATION_SENSITIVITY;
            cameraElevation += event.movementY * ROTATION_SENSITIVITY;
            cameraElevation = THREE.MathUtils.clamp(cameraElevation, MIN_CAMERA_ELEVATION, MAX_CAMERA_ELEVATION);
            updateCameraPosition();
        }

        if (isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraElevation * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(event.movementY * PAN_SENSITIVITY));
            cameraOrigin.add(left.multiplyScalar(event.movementX * PAN_SENSITIVITY));
            updateCameraPosition();
        }
        
        if (isRightMouseDown) {
            cameraRadius += event.movementY * ZOOM_SENSITIVITY;
            cameraRadius = THREE.MathUtils.clamp(cameraRadius, MIN_CAMERA_RADIUS, MAX_CAMERA_RADIUS);
            updateCameraPosition();
        }
    }

    function updateCameraPosition() {
        // involves lots of trigonometry. 
        // for reference, check spherical coordinates and how to convert them to cartesian coordinate system
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth*DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation*DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth*DEG2RAD) * Math.cos(cameraElevation*DEG2RAD);
        camera.lookAt(0, 0, 0);
        camera.updateMatrix();
    }
    
    

    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove,
    }
}