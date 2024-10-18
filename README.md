## Real-Time Food Object Detection and Recipe Generator

```bash
IngredientCV/
│
├── client/
│   ├── public/             
│   └── src/                
│       ├── App.css         
│       ├── App.js          # Main React component
│       ├── App.test.js     
│       ├── ItemList.js     # Component to display detected items
│       ├── VideoFeed.js    # Component for live Video feed
│       ├── addItem.js      # Component to add new items
│       ├── generate.js     # Component to generate meal suggestions
│       ├── index.css       
│       ├── index.js        
│       ├── logo.svg        
│       ├── reportWebVitals.js 
│       ├── setupTests.js   
│       ├── .gitignore      
│       ├── README.md      
│       ├── package-lock.json 
│       └── package.json    
│
├── python/
│   ├── model_train/
│   │   ├── runs/
│   │   │   └── detect/     # Training runs and results
│   │   ├── config.yaml     # Model config
│   │   ├── train.py        # Training script
│   │   └── yolov8n.pt      # YOLOv8 model weights
│   ├── download_data.py    # Custom script to download, merge, and export datasets
│   └── python_scripts.py   # Python utility scripts
│
├── server/
│   ├── package-lock.json   
│   ├── package.json        
│   ├── server.js           # Node.js proxy server
│   └── .gitignore          
│
├── README.md               
├── commands.txt            
├── package-lock.json       
├── package.json            
└── requirements.txt        # Python dependencies
