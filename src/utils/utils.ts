import { DEBOUNCE_INTERVAL, CANVAS_ID } from '@constants';
import { Config, EyeOfSauron } from '@interfaces/interfaces';

/**
 * given callback will be invoked if only at least debounce interval (in ms)
 * has passed since last call
 * @param callback - method which calls will be debounced
 * @param debounceInterval - debounce interval in ms
 */
export function debounce<T>(
    callback: (arg: T) => void,
    debounceInterval: number = DEBOUNCE_INTERVAL.default,
): (arg: T) => void {
    let lastCall: number = Date.now();
    return (arg: T) => {
        const currentCall = Date.now();
        // if debounce time has passed -> invoke callback
        if ((currentCall - lastCall) >= debounceInterval) {
            lastCall = currentCall;
            callback(arg);
        }
    };
}

export function initEventsCanvas(): void {
    // prevent future canvas position breaks
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    canvas.style.position = 'absolute';

    // put this canvas as first element
    document.body.insertBefore(canvas, document.body.firstChild);

    // canvas should be the same size as a body
    const fitCanvasToBodySize = () => {
        const bodyBoundingClientRect = document.body.getBoundingClientRect();
        [canvas.width, canvas.height] = [bodyBoundingClientRect.width, bodyBoundingClientRect.height];
    };
    // initital browser size
    fitCanvasToBodySize();
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', fitCanvasToBodySize);
    // add method to clean canvas
    const ctx = canvas.getContext('2d');
    extendEyeOfSauronGlobally({
        clearCanvas: () => ctx?.clearRect(0, 0, canvas.width, canvas.height)
    });
}

export const getConfig = (): Config => window?.eyeOfSauron?.config ?? {};

export const extendEyeOfSauronGlobally = (params: EyeOfSauron): void => {
    window.eyeOfSauron = {
        ...(window.eyeOfSauron ?? {}),
        ...params,
    };
};
