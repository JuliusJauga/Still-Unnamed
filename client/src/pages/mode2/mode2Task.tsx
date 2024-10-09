import Canvas from "./canvas";
import { vec2, droppingText, GameData } from "./canvas";

import { useEffect, useState, useRef } from "react";


const mode2Task = () => {
    const [canvasSize, setCanvasSize] = useState<vec2>({ x: 1200, y: 600 });
    const [playerPos, setPlayerPos] = useState<vec2>({ x: 0, y: 0.1});
    const [textArray, setTextArray] = useState<droppingText[]>([]);
    const playerPosRef = useRef<vec2>(); playerPosRef.current = playerPos;
    const textArrayRef = useRef<droppingText[]>(); textArrayRef.current = textArray;
    

    const handleMouseMove = (e: any) => {
        const pos = { x: e.clientX / canvasSize.x, y: 0.1 };
        setPlayerPos(pos);
    };
    
    const onTick = (context: CanvasRenderingContext2D, dt: number) => {
        if (playerPosRef === undefined || playerPosRef.current === undefined) return undefined;
        if (textArrayRef === undefined || textArrayRef.current === undefined) return undefined;
        
        const playerRadius = 0.05;
        const textArray = textArrayRef.current;

        // spawn new text
        const difficulty = 0.01;
        if (Math.random() < difficulty * 2 && textArray.length < difficulty * 400) {
            const texts = ["Hello", "World", "Test", "Sample", "Random", "Text", "Example"];
            const text = texts[Math.floor(Math.random() * texts.length)];
            const angle = 0;
            const color = "black";
            const pos = { x: Math.random() * 0.8 + 0.1, y: 1 };
            const rotSpeed = (Math.random() < 0.5 ? -1 : 1) * 
            Math.min(Math.max(0.0002, Math.random() * 0.01), difficulty / 4);
            const fallSpeed = Math.min(Math.max(0.0002,  Math.random() * 0.001), difficulty / 20);
            const size = Math.floor(Math.random() * 20 + 20);
            textArray.push({ text, pos, color, angle, rotSpeed, fallSpeed, size });
        }

        // collisions
        for (let i = 0; i < textArray.length; i++) {
            const text = textArray[i];
            // move the text
            text.pos.y -= text.fallSpeed * dt;
            text.angle += text.rotSpeed * dt;

            const playerPos = {x: playerPosRef.current.x, y: playerPosRef.current.y};
            
            // get text size and pos
            const metrics = context.measureText(text.text);
            const width = metrics.width / canvasSize.x;
            const height = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / canvasSize.y;
            
            const centerPos = {x: text.pos.x, y: text.pos.y + height / 2};
            const aspectRatio = canvasSize.x / canvasSize.y;
            const minPos = {x: centerPos.x - width / 2, y: centerPos.y - height / 2 * aspectRatio};
            const maxPos = {x: centerPos.x + width / 2, y: centerPos.y + height / 2 * aspectRatio};

            // Rotate circle's center point back
            const unrotatedPlayer = {
                x: Math.cos(text.angle) * (playerPos.x - centerPos.x) -
                   Math.sin(text.angle) * (playerPos.y - centerPos.y) + centerPos.x,
                y: Math.sin(text.angle) * (playerPos.x - centerPos.x) +
                   Math.cos(text.angle) * (playerPos.y - centerPos.y) + centerPos.y
            };

            let closestPoint = {x: 0, y: 0};
            if (unrotatedPlayer.x < minPos.x)
                closestPoint.x = minPos.x;
            else if (unrotatedPlayer.x > maxPos.x)
                closestPoint.x = maxPos.x;
            else
                closestPoint.x = unrotatedPlayer.x;

            if (unrotatedPlayer.y < minPos.y)
                closestPoint.y = minPos.y;
            else if (unrotatedPlayer.y > maxPos.y)
                closestPoint.y = maxPos.y;
            else
                closestPoint.y = unrotatedPlayer.y;

            const a = Math.abs(unrotatedPlayer.x - closestPoint.x);
            const b = Math.abs(unrotatedPlayer.y - closestPoint.y);
            const distance = Math.sqrt((a * a) + (b * b));

            
            if (text.pos.y < 0) {
                textArray.splice(i, 1);
                i--;
                // TODO: lose points
            }
            if (distance > playerRadius) continue;
            
            textArray.splice(i, 1);
            i--;

            // TODO: give points

            
        }


        return {
            playerPos: playerPosRef.current,
            textArray: textArray,
        };
    };

    return (
        <>
            <Canvas
                canvasSize={canvasSize}
                onTick={onTick}
                onMouseMove={handleMouseMove}
            />
        </>
    );
};

export default mode2Task;