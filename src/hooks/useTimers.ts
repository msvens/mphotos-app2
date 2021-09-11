import {useEffect, useRef} from "react";

type TimerCallback = () => void
type TimerType = (callback: TimerCallback, delay: number|null) => TimerCallback

export const useInterval: TimerType = (callback, delay) => {
    const savedCallback = useRef <TimerCallback> (callback)
    const intervalRef = useRef <NodeJS.Timeout> ()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if(delay !== null) {
            intervalRef.current = setInterval(() => savedCallback.current(), delay)
            return () => clearInterval(intervalRef.current!)
        }
    }, [delay])

    function cancelInterval() {
        if(intervalRef.current) {
            window.clearInterval(intervalRef.current)
        }
    }
    return cancelInterval
}