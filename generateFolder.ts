// eslint-disable-next-line @typescript-eslint/no-var-requires
// import  fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import  path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function capitalizeFirstLetter(text) {
  const [first = '', ...rest] = text;
  return [first.toUpperCase(), ...rest].join('');
}

// Function to create the folder and files
function createFolderAndFiles(parentFolderPath, folderName) {
  const folderPath = path.join(parentFolderPath, folderName);
  fs.mkdirSync(folderPath);

  const files = [
    `${folderName}.constants.ts`,
    `${folderName}.controller.ts`,
    `${folderName}.interface.ts`,
    `${folderName}.models.ts`,
    `${folderName}.route.ts`,
    `${folderName}.service.ts`,
    `${folderName}.utils.ts`,
    `${folderName}.validation.ts`,
  ];

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    let content = '';

    if (file === `${folderName}.service.ts`) {
      content = `const create${capitalizeFirstLetter(folderName)} = async () => {};
const getAll${capitalizeFirstLetter(folderName)} = async () => {};
const get${capitalizeFirstLetter(folderName)}ById = async () => {};
const update${capitalizeFirstLetter(folderName)} = async () => {};
const delete${capitalizeFirstLetter(folderName)} = async () => {};

export const ${folderName}Service = {
  create${capitalizeFirstLetter(folderName)},
  getAll${capitalizeFirstLetter(folderName)},
  get${capitalizeFirstLetter(folderName)}ById,
  update${capitalizeFirstLetter(folderName)},
  delete${capitalizeFirstLetter(folderName)},
};`;
    } else if (file === `${folderName}.controller.ts`) {
      content = `import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const create${capitalizeFirstLetter(folderName)} = catchAsync(async (req: Request, res: Response) => {});
const getAll${capitalizeFirstLetter(folderName)} = catchAsync(async (req: Request, res: Response) => {});
const get${capitalizeFirstLetter(folderName)}ById = catchAsync(async (req: Request, res: Response) => {});
const update${capitalizeFirstLetter(folderName)} = catchAsync(async (req: Request, res: Response) => {});
const delete${capitalizeFirstLetter(folderName)} = catchAsync(async (req: Request, res: Response) => {});

export const ${folderName}Controller = {
  create${capitalizeFirstLetter(folderName)},
  getAll${capitalizeFirstLetter(folderName)},
  get${capitalizeFirstLetter(folderName)}ById,
  update${capitalizeFirstLetter(folderName)},
  delete${capitalizeFirstLetter(folderName)},
};`;
    } else if (file === `${folderName}.route.ts`) {
      content = `import { Router } from 'express';
import { ${folderName}Controller } from './${folderName}.controller';

const router = Router();

router.post('/create-${folderName}', ${folderName}Controller.create${capitalizeFirstLetter(folderName)});

router.patch('/update/:id', ${folderName}Controller.update${capitalizeFirstLetter(folderName)});

router.delete('/:id', ${folderName}Controller.delete${capitalizeFirstLetter(folderName)});

router.get('/:id', ${folderName}Controller.get${capitalizeFirstLetter(folderName)}ById);
router.get('/', ${folderName}Controller.getAll${capitalizeFirstLetter(folderName)});

export const ${folderName}Routes = router;`;
    }

    fs.writeFileSync(filePath, content, 'utf8');
  });

  // console.log(`Folder "${folderName}" and files created successfully.`);
}

// Prompting the user for the parent folder path and folder name
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter parent folder path: ', (parentFolderPath) => {
  readline.question('Enter folder name: ', (folderName) => {
    createFolderAndFiles(parentFolderPath, folderName);
    readline.close();
  });
});
