import React, { useState } from "react";
import Papa from "papaparse";

const CSVMerger = () => {
  const [files, setFiles] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  // Handle file input changes
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };

  // Merge CSV files and handle extra commas
  const mergeCSVFiles = () => {
    const allData = [];
    const filePromises = [];
    const columnHeaders = new Set();  // To track unique headers across all files

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePromise = new Promise((resolve, reject) => {
        Papa.parse(file, {
          complete: (result) => {
            // Check if there are headers in the file
            const headers = result.meta.fields;
            if (headers) {
              headers.forEach(header => columnHeaders.add(header));  // Add headers to the set
            }

            // Filter out empty rows and rows with missing columns
            const filteredData = result.data.filter(row => {
              // Check if the row has valid data (not just empty values)
              return Object.values(row).some(value => value.trim() !== '');
            });

            allData.push(...filteredData);  // Merge data into allData array
            resolve();
          },
          error: (error) => reject(error),
          header: true,  // Assuming CSVs have headers
        });
      });

      filePromises.push(filePromise);
    }

    // Wait for all files to be parsed, then update the state with merged data
    Promise.all(filePromises)
      .then(() => {
        // Now that all files are merged, let's add any missing columns to each row
        const headersArray = Array.from(columnHeaders);

        // Add missing columns to each row
        const finalData = allData.map(row => {
          const newRow = { ...row };  // Clone the row
          headersArray.forEach(header => {
            if (!(header in newRow)) {
              newRow[header] = '';  // Add empty value for missing columns
            }
          });
          return newRow;
        });

        setMergedData(finalData);  // Update state with merged and normalized data
      })
      .catch((err) => {
        console.error("Error merging CSV files:", err);
      });
  };

  // Convert merged data to CSV format and trigger download
  const downloadMergedCSV = () => {
    const csv = Papa.unparse(mergedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "merged_file.csv";
    link.click();
  };

  return (
    <div>
      <h1>CSV Merger</h1>
      <input
        type="file"
        multiple
        accept=".csv"
        onChange={handleFileChange}
      />
      <button onClick={mergeCSVFiles}>Merge CSV Files</button>

      {mergedData.length > 0 && (
        <div>
          <button onClick={downloadMergedCSV}>Download Merged CSV</button>
          <pre>{JSON.stringify(mergedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CSVMerger;
