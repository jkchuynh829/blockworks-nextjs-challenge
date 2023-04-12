import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

const dataPath = path.join(
  process.cwd(),
  "data",
  "Coin_Metrics_Network_Data_2023-02-02T14-32.csv"
);

const COLUMN_NAMES = {
  time: "Time",
  ">$1k": "BTC / Addr Cnt of Bal ≥ $1K",
  ">$10k": "BTC / Val in Addrs w/ Bal ≥ $10K USD",
  ">$100k": "BTC / Val in Addrs w/ Bal ≥ $100K USD",
  ">$1m": "BTC / Val in Addrs w/ Bal ≥ $1M USD",
  ">$10m": "BTC / Val in Addrs w/ Bal ≥ $10M USD",
};

const formatData = (data: any[]) => {
  return data.map((item) => {
    const time = new Date(item[COLUMN_NAMES.time]);
    return {
      time: time,
      [">$1k"]: parseFloat(item[COLUMN_NAMES[">$1k"]]),
      [">$10k"]: parseFloat(item[COLUMN_NAMES[">$10k"]]),
      [">$100k"]: parseFloat(item[COLUMN_NAMES[">$100k"]]),
      [">$1m"]: parseFloat(item[COLUMN_NAMES[">$1m"]]),
      [">$10m"]: parseFloat(item[COLUMN_NAMES[">$10m"]]),
    };
  });
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const data: any[] = [];

  fs.createReadStream(dataPath, "utf16le")
    .pipe(
      csvParser({
        separator: "\t",
        mapHeaders: ({ header }) => {
          return header.replace(/"/g, "").trim();
        },
        mapValues: ({ value }) => value.trim(),
      })
    )
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", () => {
      const formatedtData = formatData(data);
      res.status(200).json(formatedtData);
    })
    .on("error", (error) => {
      res.status(500).json({ message: "Error processing CSV file", error });
    });
};
