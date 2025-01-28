import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PROJECT_API_END_POINT } from '@/utils/constant';
import 'prismjs';
import 'prismjs/themes/prism.css';
import { useSelector } from 'react-redux';
import Prism from 'prismjs';
import { FiDownload } from 'react-icons/fi';

const FolderViewer = ({ files }) => {
  const [openFolders, setOpenFolders] = useState([]);
  const [previewContent, setPreviewContent] = useState(null); // State for preview content
  const [previewLanguage, setPreviewLanguage] = useState(''); // To store language for syntax highlighting
  const { singleProject } = useSelector(store => store.project);
  const userId = singleProject?.user?._id;

  const toggleFolder = (folderPath) => {
    setOpenFolders((prevState) => {
      if (prevState.includes(folderPath)) {
        return prevState.filter((path) => path !== folderPath);
      }
      return [...prevState, folderPath];
    });
  };

  const isPreviewable = (fileName) => {
    const previewExtensions = [
      '.png', '.jpg', '.jpeg', '.gif', '.txt', '.pdf', '.svg', // existing extensions
      '.mp4', '.mov', '.webm', // video files
      '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx','.json', // document files
      '.csv', '.json', '.xml', // data files
      '.md', // markdown files
      '.bmp', '.tiff', // other image formats
    ];
    
    return previewExtensions.some((ext) => fileName.endsWith(ext));
  };

  const isCodeFile = (fileName) => {
    const codeExtensions = [
      '.html', '.js', '.css', '.jsx', '.ts', '.ejs' ,'.tsx',   // Standard web development files
      '.php', '.py', '.java', '.c', '.cpp', '.h',        // Other programming languages
      '.rb', '.go', '.swift', '.kotlin', '.scala',        // More programming languages
      '.json', '.yaml', '.xml',                         // Configuration and data files
      '.bash', '.sh', '.zsh',  'json',                          // Shell scripts
      '.css', '.sass', '.scss',                          // CSS preprocessors
      '.lua', '.rust',                                  // Other languages
      '.md', '.rmd',                                    // Markdown files (useful for documentation)
    ];
    
    return codeExtensions.some((ext) => fileName.endsWith(ext));
  };

  const fetchFileContent = async (fileUrl, fileName) => {
    try {
      const response = await axios.get(fileUrl, { responseType: 'text' });
      setPreviewContent(response.data);  // Set the file content in state

      // Set language for syntax highlighting based on file extension
      const ext = fileName.split('.').pop();
      setPreviewLanguage(ext);

      // Apply syntax highlighting
      Prism.highlightAll();
    } catch (err) {
      console.error('Error fetching code file:', err);
      alert('Error loading code.');
    }
  };

  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = true;
    link.click();
  };

  const renderFileStructure = (items, parentPath = '') => {
    return items.map((item, index) => {
      const fullPath = `${parentPath}/${item.name}`;
      const uniqueKey = `${item.name}-${index}`;

      if (item.type === 'folder') {
        return (
          <React.Fragment key={uniqueKey}>
            <tr>
              <td
                colSpan="2"
                style={{
                  paddingLeft: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0',
                }}
                onClick={() => toggleFolder(item.name)}
              >
                {openFolders.includes(item.name) ? '[-]' : '[+]'}{' '}
                <code>{item.name}</code>
              </td>
            </tr>
            {openFolders.includes(item.name) &&
              renderFileStructure(item.contents, fullPath)}
          </React.Fragment>
        );
      }
      const projectId = singleProject.projectId;
      const fileUrl = `https://projectshowcase.onrender.com/uploads/${userId}/${projectId}/${fullPath.replace(/\/+/g, '/')}`;

      return (
        <tr key={uniqueKey}>
          <td style={{ paddingLeft: '40px', background: "f5f5f5" }}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (isCodeFile(item.name)) {
                  e.preventDefault(); // Prevent default link action if it's a code file
                  fetchFileContent(fileUrl, item.name); // Fetch and preview the code content in the same window
                } else if (!isPreviewable(item.name)) {
                  e.preventDefault();
                  alert('Preview not available. The file will be downloaded.');
                }
              }}
            >
              <code>{item.name}</code>
            </a>
          </td>
          <td>
            {item.name.endsWith('.zip') && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(fileUrl);
                }}
                style={{
                  padding: '5px 10px',
                  color: 'black',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  backgroundColor: '#f0f0f0',
                }}
              >
                <FiDownload />
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                wordWrap: 'break-word',
              }}
            >
              File/Folder Name
            </th>
            <th
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                wordWrap: 'break-word',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{renderFileStructure(files)}</tbody>
      </table>

      {/* Preview Section */}
      {previewContent && (
        <div style={{ marginTop: '20px' }}>
          <h3>Code Preview:</h3>
          <pre className={`language-${previewLanguage}`}>{previewContent}</pre>
          <button
            onClick={() => setPreviewContent(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectFiles = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {singleProject} = useSelector(store => store.project);
  const projectId = singleProject.projectId;
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${PROJECT_API_END_POINT}/${userId}/${projectId}/files`, { withCredentials: true });
        if (response.data.files) {
          setFiles(response.data.files);
        } else {
          setError('No files found for the project.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching files. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  if (loading) return <div>Loading project files...</div>;

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2 className="font-bold mt-5 text-xl">Uploaded Files</h2>
      <FolderViewer files={files} />
    </div>
  );
};

export default ProjectFiles;
