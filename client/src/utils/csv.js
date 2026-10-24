// Same CSV generation logic as the original single-file app
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return false;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((obj) => Object.values(obj).map((val) => `"${val}"`).join(','));
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
