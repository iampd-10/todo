import dotenv from 'dotenv';
dotenv.config();

export const home = async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Server Running</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
          font-family: 'Segoe UI', sans-serif;
        }
        .message-box {
          text-align: center;
          background: #ffffff;
          padding: 40px 60px;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        h1 {
          color: #0d6efd;
          margin-bottom: 10px;
        }
        p {
          color: #333;
          font-size: 18px;
          margin: 0;
        }
        h5{
        font-size: 12px;
        color: solid black;
        
        }
      </style>
    </head>
    <body>
      <div class="message-box">
        <h1>🚀 Server is Running</h1>
        <p>Hello from the server i.e running on port ${process.env.PORT}</p>
        <h5>Priyajit Debnath</h5>
        </div>
    </body>
    </html>
  `);
};
