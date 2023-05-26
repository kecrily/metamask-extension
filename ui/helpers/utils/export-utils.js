export async function exportAsFile(filename, data, type = 'application/json') {
  if (supportsShowSaveFilePicker()) {
    // Preferred method for downloads
    await saveFileUsingFilePicker(filename, data, type);
  } else {
    saveFileUsingDataUri(filename, data, type);
  }
}

function supportsShowSaveFilePicker() {
  return window.showSaveFilePicker !== undefined;
}

async function saveFileUsingFilePicker(filename, data, type) {
  // eslint-disable-next-line no-undef
  const blob = new Blob([data], { type });
  const text = await blob.text();
  console.log('BLOB', text);
  const handle = await window.showSaveFilePicker({
    suggestedName: filename,
    types: [
      {
        description: 'MetaMask State Logs',
        accept: { 'application/json': ['.json'] },
      },
    ],
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function saveFileUsingDataUri(filename, data, type) {
  const b64 = Buffer.from(data, 'utf8').toString('base64');
  const elem = window.document.createElement('a');

  elem.href = `data:${type};Base64,${b64}`;
  elem.download = filename;

  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
