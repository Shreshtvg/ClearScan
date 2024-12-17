const fs = require('fs').promises;
const Tesseract = require('tesseract.js'); // OCR library for image parsing
const pdfParse = require('pdf-parse'); // PDF parsing library

// Regex for extracting sensitive data
const extractDataUsingRegex = (fileContent) => {
    const patterns = {
        PII: {
            PAN : /[A-Z]{5}[0-9]{4}[A-Z]{1}/g, // Indian PAN
            SSN: /\b\d{3}-\d{2}-\d{4}\b/g, // US Social Security Number
            EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
            PHONE: /\b\+?1?\d{9,15}\b/g, // Phone number
            DOB: /\b\d{2}\/\d{2}\/\d{4}\b/g, // DOB in format nn/nn/nn
            AADHAAR: /\b\d{4} \d{4} \d{4}\b/g, // Aadhaar with spaces
        },
        PHI: {
            HEALTH_INSURANCE: /HI\d{10}/g, // Health insurance number
            BLOOD_TYPE: /\b(?:A|B|AB|O)[+-]\b/g, // Blood types like A+, O-
        },
        PCI: {
            CREDIT_CARD: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit card numbers
            CVV: /\bCVV:?\s*\d{3,4}\b/g, // CVV numbers
            EXPIRY: /\b(0[1-9]|1[0-2])\/\d{2}\b/g, // Expiry date in MM/YY format
        },
    };

    const pii = {
        panNumbers: fileContent.match(patterns.PII.PAN) || [],
        ssnNumbers: fileContent.match(patterns.PII.SSN) || [],
        emails: fileContent.match(patterns.PII.EMAIL) || [],
        phoneNumbers: fileContent.match(patterns.PII.PHONE) || [],
        dob: fileContent.match(patterns.PII.DOB) || [],
        aadharNumbers: fileContent.match(patterns.PII.AADHAAR) || [],
    };

    const phi = {
        healthInsuranceNumbers: fileContent.match(patterns.PHI.HEALTH_INSURANCE) || [],
        bloodTypes: fileContent.match(patterns.PHI.BLOOD_TYPE) || [],
    };

    const pci = {
        creditCardNumbers: fileContent.match(patterns.PCI.CREDIT_CARD) || [],
        cvvNumbers: fileContent.match(patterns.PCI.CVV) || [],
        expiryDates: fileContent.match(patterns.PCI.EXPIRY) || [],
    };

    return { pii, phi, pci };
};

// Function for processing image files
const processImageFile = async (imageBuffer) => {
    try {
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
            logger: (m) => console.log(m), // Optional: log the OCR progress
        });
        return extractDataUsingRegex(text); // Perform regex matching on the extracted text
    } catch (error) {
        console.error('OCR Error:', error);
        return {}; // Return empty object in case of error
    }
};

// Function for processing PDF files
const processPdfFile = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer); // Parse the PDF and get its text content
        return extractDataUsingRegex(data.text); // Perform regex matching on the extracted text
    } catch (error) {
        console.error('Error processing PDF:', error);
        return [];
    }
};

// Combined function for handling both text, PDF, and image files
const processFile = async (file) => {
    if (file.mimetype === 'application/pdf') {
        // If PDF, process PDF file
        const pdfBuffer = await fs.readFile(file.path); // Read the PDF file buffer
        return processPdfFile(pdfBuffer);
    } else if (file.mimetype === 'text/plain') {
        // If plain text, process text file
        const fileContent = await fs.readFile(file.path, 'utf-8'); // Read the plain text file content
        return extractDataUsingRegex(fileContent);
    } else if (file.mimetype === 'image/jpeg') {
        // If image file, process image using OCR
        const imageBuffer = await fs.readFile(file.path); // Read the image file buffer
        return processImageFile(imageBuffer);
    } else {
        throw new Error('Unsupported file type');
    }
};

module.exports = { processFile };
