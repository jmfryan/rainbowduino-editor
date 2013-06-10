#include <WProgram.h>
#include <Rainbowduino.h>

const int BAUD_RATE = 9600;
const int DISPLAY_WIDTH = 8;
const int DISPLAY_HEIGHT = 8;

enum COMMANDS 
{
  START_GRAPHIC = 0, 
  END_GRAPHIC,
  SET_PIXEL
};

enum PACKET_DETAILS
{
    PACKET_SIZE = 0,
    CMD_LOC = 1,
    PACKET_DATA = 2,
    MAX_PACKET_SIZE = 16
};

enum PIXEL_PACKET_DETAILS
{
    X_LOC = 2,
    Y_LOC = 3,
    R_LOC = 4,
    G_LOC = 5,
    B_LOC = 6
};

uint32_t buffer[DISPLAY_WIDTH * DISPLAY_HEIGHT];

void start_graphic(byte data[])
{ 
}

void end_graphic(byte data[])
{
    Rb.clearDisplay();

    for(int y = 0; y < DISPLAY_HEIGHT; y++)
    {
        for(int x = 0; x < DISPLAY_WIDTH; x++)
        {
            int index = x + (y * DISPLAY_WIDTH);
            Rb.setPixelXY(x, y, buffer[index]);
        }
    }           
}

void set_pixel(byte data[])
{
    int index = data[X_LOC] + (DISPLAY_WIDTH * data[Y_LOC]);
    buffer[index] = ((uint32_t)data[R_LOC] << 16) | ((uint32_t)data[G_LOC] << 8) | data[B_LOC];
}

struct
{
    byte data[MAX_PACKET_SIZE]; //this is where we will store the data we receive from the serial
    byte current_location; //this is the counter to keep track of how many bytes we've received
} dataPacket;

void ack()
{
    Serial.print(1);
}

int receieve_packet()
{
    dataPacket.data[dataPacket.current_location] = Serial.read();
    dataPacket.current_location++;

    if (dataPacket.current_location == dataPacket.data[PACKET_SIZE] || 
        dataPacket.current_location == MAX_PACKET_SIZE)
    {
        dataPacket.current_location = 0;

        switch ( dataPacket.data[CMD_LOC] )
        {
            case START_GRAPHIC:
                start_graphic(dataPacket.data);
                break;

            case END_GRAPHIC:
                end_graphic(dataPacket.data);
                break;

            case SET_PIXEL:
                set_pixel(dataPacket.data);
                break;

            default:
                Serial.printf("BAD DATA %s\n", dataPacket.data[0]);
        }

        ack();
    }
}

void setup()
{
    Serial.begin(BAUD_RATE);
    Rb.init();
    Rb.clearDisplay();
    ack();
}

void loop()
{
    while ( Serial.available())
    {
        receieve_packet(); //plug it into state machine.
    }
}


