const express = require("express"),
  cors = require("cors");

const Burger = require("./Models/burgerModel");

const db = require("./db.js");
const app = express();

//Paytm part//

const https = require("https");
const qs = require("querystring");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");

app.get("/", (req, res) => {
  res.send("Server is working !!");
});

app.use(express.json());
app.use(cors());
app.post("/paynow", [parseUrl, parseJson], (req, res) => {
  // Route for making payment

  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.name,
    customerEmail: req.body.email,
    customerPhone: req.body.phone,
  };
  if (
    !paymentDetails.amount ||
    !paymentDetails.customerId ||
    !paymentDetails.customerEmail ||
    !paymentDetails.customerPhone
  ) {
    res.status(400).send("Payment failed");
  } else {
    var params = {};
    params["MID"] = config.PaytmConfig.mid;
    params["WEBSITE"] = config.PaytmConfig.website;
    params["CHANNEL_ID"] = "WEB";
    params["INDUSTRY_TYPE_ID"] = "Retail";
    params["ORDER_ID"] = "TEST_" + new Date().getTime();
    params["CUST_ID"] = paymentDetails.customerId;
    params["TXN_AMOUNT"] = paymentDetails.amount;
    params[
      "CALLBACK_URL"
    ] = `https://burgerqueen-vs.herokuapp.com/callback/?amount=${paymentDetails.amount}`;
    params["EMAIL"] = paymentDetails.customerEmail;
    params["MOBILE_NO"] = paymentDetails.customerPhone;
    // params["REFUND"]=paymentDetails.amount;

    checksum_lib.genchecksum(
      params,
      config.PaytmConfig.key,
      function (err, checksum) {
        var txn_url =
          "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
          form_fields +=
            "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields +=
          "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(
          '<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' +
            txn_url +
            '" name="f1">' +
            form_fields +
            '</form><script type="text/javascript">document.f1.submit();</script></body></html>'
        );
        res.end();
      }
    );
  }
});

app.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = "";
  let {amount}=req.query; 

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    var html = "";
    var post_data = qs.parse(body);

    // received params in callback
    console.log("Callback Response: ", post_data, "\n");

    // verify the checksum
    var checksumhash = post_data.CHECKSUMHASH;
    // delete post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(
      post_data,
      config.PaytmConfig.key,
      checksumhash
    );
    console.log("Checksum Result => ", result, "\n");

    // Send Server-to-Server request to verify Order Status
    var params = { MID: config.PaytmConfig.mid, ORDERID: post_data.ORDERID };

    checksum_lib.genchecksum(
      params,
      config.PaytmConfig.key,
      function (err, checksum) {
        params.CHECKSUMHASH = checksum;
        post_data = "JsonData=" + JSON.stringify(params);

        var options = {
          hostname: "securegw-stage.paytm.in", // for staging
          // hostname: 'securegw.paytm.in', // for production
          port: 443,
          path: "/merchant-status/getTxnStatus",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": post_data.length,
          },
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            console.log("S2S Response: ", response, "\n");

            var _result = JSON.parse(response);
            if (_result.STATUS == "TXN_SUCCESS") {
              //  res.send("payment success");
              // window.alert("payment success");
              res.redirect(`https://burgerqueen-vs.netlify.app/payment/?status=true&amount=${amount}`);
            } else {
              // res.send("payment failed");
              // window.alert("payment failed");
              res.redirect(`https://burgerqueen-vs.netlify.app/payment/?status=false&amount=${amount}`);
            }
          });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
      }
    );
  });
});
//******************************* */

const path = require("path");

const burgerRoute = require("./routes/burgerRoute");

const userRoute = require("./routes/userRoute");

const ordersRoute = require("./routes/ordersRoute");

app.use("/api/burgers/", burgerRoute);

app.use("/api/users/", userRoute);

app.use("/api/orders/", ordersRoute);

app.get("/", (req, res) => {
  res.send("Server Working : " + port);
});

// app.get("/getburgers", (req, res) => {
//   Burger.find({}, (err, docs) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(docs);
//     }
//   });
// });

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
