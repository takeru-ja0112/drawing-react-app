"use client";

import type { DrawingDataType } from "@/type/DrawingDataType";
import { motion } from "framer-motion";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import Card from "../atoms/Card";

export default function MuseumPage({
  arts
}: {
  arts: Array<DrawingDataType>;
}) {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-500">過去のイラスト</h1>
      </div>
      <ul>
        <div
          className="mb-4 flex overflow-x-scroll space-x-6 first:pl-6 last:pr-6"
        >
          {arts.map((art) => (
            <motion.div
              key={art.id}
            >
              <Card key={art.id}>
                <div className="p-4 bg-yellow-500 rounded-lg rounded-b-none text-center">
                  <h2 className="text-lg font-semibold text-yellow-900/70">お題</h2>
                  <h2 className="text-2xl font-semibold">{art.theme}</h2>
                </div>
                <div
                  className="bg-white border-4 rounded-lg border-yellow-500 rounded-t-none flex justify-center items-center">
                  <Stage width={300} height={300} key={art.id} className="">
                    <Layer>
                      {art.canvas_data.lines.map((line, i) => (
                        <Line
                          key={`line-${i}`}
                          points={line}
                          stroke="black"
                          strokeWidth={3}
                        />
                      ))}
                      {art.canvas_data.circles.map(
                        (circle, i) => (
                          <Circle
                            key={`circle-${i}`}
                            x={circle.x}
                            y={circle.y}
                            radius={circle.radius}
                            stroke="black"
                            strokeWidth={3}
                          />
                        ),
                      )}
                      {art.canvas_data.rects.map((rect, i) => (
                        <Rect
                          key={`rect-${i}`}
                          x={rect.x}
                          y={rect.y}
                          width={rect.width}
                          height={rect.height}
                          stroke="black"
                          strokeWidth={3}
                        />
                      ))}
                    </Layer>
                  </Stage>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ul>
    </>
  );
}