import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg pt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img src={"/chessboard.jpeg"} className="max-w-96" />
          </div>
          <div className="pt-16 flex justify-center">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Play chess online on the #2 Site!
              </h1>
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => {
                    navigate("/game");
                  }}
                >
                  Play Online
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};