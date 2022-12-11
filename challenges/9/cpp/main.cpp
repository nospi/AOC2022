#define OLC_PGE_APPLICATION
#define OLC_PGEX_TRANSFORMEDVIEW

#include <iostream>
#include <string>
#include "olcPixelGameEngine.h"
#include "olcPGEX_TransformedView.h"
#include <vector>

#include "input.cpp"

class olcAOC : public olc::PixelGameEngine
{
public:
    olcAOC()
    {
        sAppName = "olcAOC";
    }

    bool OnUserCreate() override
    {
        ttv.Initialise({ScreenWidth(), ScreenHeight()}, {10.0f, 10.0f});
        return true;
    }

    bool OnUserUpdate(float fElapsedTime) override
    {
        ttv.HandlePanAndZoom();

        if (GetKey(olc::SPACE).bPressed)
            running = !running;

        if (running)
        {
            currentFrame += fElapsedTime;
            if (currentFrame >= frameTime)
            {
                currentFrame -= frameTime;

                if (instructionIndex < MY_CHALLENGE_INPUT.size())
                {
                    // move head
                    std::string dir = MY_CHALLENGE_INPUT[instructionIndex++];

                    if (dir == "U")
                    {
                        head.y--;
                    }
                    else if (dir == "D")
                    {
                        head.y++;
                    }
                    else if (dir == "L")
                    {
                        head.x--;
                    }
                    else if (dir == "R")
                    {
                        head.x++;
                    }

                    // move tail
                    int dx = head.x - tail.x;
                    int dy = head.y - tail.y;
                    if (abs(dx) == 2 && dy == 0)
                    {
                        tail.x += dx / 2;
                    }
                    else if (abs(dy) == 2 && dx == 0)
                    {
                        tail.y += dy / 2;
                    }
                    else if (abs(dy) + abs(dx) > 2)
                    {
                        tail.x += dx / abs(dx);
                        tail.y += dy / abs(dy);
                    }

                    // add new point to visited if it isn't in there already
                    if (std::find(visited.begin(), visited.end(), tail) == visited.end())
                    {
                        nVisited++;
                        visited.push_back(tail);
                    }
                }
                else
                {
                    running = false;
                }
            }
        }

        // draw
        Clear(0);
        for (int i = 0; i < visited.size(); i++)
            ttv.FillRect(visited[i] * size, size, olc::GREY);
        ttv.FillRect(tail * size, size, olc::GREEN);
        ttv.FillRect(head * size, size, olc::RED);

        std::string sVisited = "Cells Visited: " + std::to_string(nVisited);
        DrawString({10, 10}, sVisited);

        return !(GetKey(olc::ESCAPE).bPressed);
    }

private:
    olc::TileTransformedView ttv;
    olc::vf2d head;
    olc::vf2d tail;
    std::vector<olc::vf2d> visited;
    olc::vf2d size = {10.0f, 10.0f};

    float frameTime = 0.0f;
    float currentFrame = 0.0f;
    int instructionIndex = 0;
    int nVisited = 0;

    bool running = false;
};

int main(int argc, char *argv[])
{
    olcAOC app;
    if (app.Construct(800, 600, 1, 1))
        app.Start();
    return 0;
}