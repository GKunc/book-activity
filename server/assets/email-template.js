exports.HTML_TEMPLATE = (text) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Book Activity</title>
    <style>
      .container {
        width: 90%;
        height: 90%;
        padding: 20px;
        background-color: white;
      }
      .email {
        width: 80%;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
      }
      .email-header {
        background-color: #fff;
        color: #008dff;
        padding: 10px;
        text-align: center;
      }
      .email-body {
        margin: 0 auto;
        text-align: center;
        padding: 20px;
        gap: 16px;
      }
      .button {
        margin-top: 20px;
        background-color: #008dff;
        color: white;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        border: 1px solid #d9d9d9;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        -webkit-user-select: none;
        user-select: none;
        height: 32px;
        padding: 4px 15px;
        border-radius: 2px;
      }
      .button-link {
        color: white;
        font-weight: 400;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="email">
        <div class="email-header">
          <h1>Book Activity</h1>
        </div>
        <div class="email-body">
          <div>Potwierdz adres email i zacznij korzystac ze swojego konta</div>
          <br />
          <div>
            <a class="button" target="_blank" href="https://www.google.com/">Potwierdz</a>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};
