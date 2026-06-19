import ExcelJS from 'exceljs';
import { test, expect } from '@playwright/test';

async function excelTest(searchText, replaceText, change, filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = await readExcel(worksheet, searchText);
    const cell = worksheet.getCell(output.row, output.column + change.colChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
    let output = {
        row: -1,
        column: -1
    };
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                output.row = rowNumber;
                output.column = colNumber;
            }
        })
    })
    return output;
}

test('Upload download excel validation', async ({ page }) => {
    const searchText = 'Mango';

    const updatedValue = 350;

    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

    const downloadPromise = page.waitForEvent("download");

    await page.getByRole("button", { name: "Download" }).click();

    const download = await downloadPromise;

    const filePath = "D:/Downloads/download.xlsx";

    await download.saveAs(filePath);

    await excelTest(searchText, updatedValue, { rowChange: 0, colChange: 2 }, filePath);

    await page.locator("#fileinput").setInputFiles(filePath);

    const textLocator = page.getByText(searchText);

    const desiredRow = page.getByRole('row').filter({ has: textLocator });

    await expect(desiredRow.locator("#cell-4-undefined")).toHaveText(updatedValue.toString());
});