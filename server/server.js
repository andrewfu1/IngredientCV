const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 5001;

// app.use((req, res, next) => {
//     console.log(`Request received: ${req.method} ${req.url}`);
//     next();
// });

app.use('/video_feed', createProxyMiddleware({
    target: 'http://localhost:5002/video_feed',
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
        console.log('Proxied request to Flask:', proxyReq.path);
    }
}));

app.use('/item_list', createProxyMiddleware({
    target: 'http://localhost:5002/item_list',
    changeOrigin: true,
    logLevel: 'silent',
    // onProxyReq(proxyReq, req, res) {
    //     console.log('Proxied request to Flask:', proxyReq.path);
    // }
}));

app.use('/add_item', createProxyMiddleware({
    target: 'http://localhost:5002/add_item',
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
        console.log('Proxied request to Flask:', proxyReq.path);
    }
}));

app.use('/generate_meals', createProxyMiddleware({
    target: 'http://localhost:5002/generate_meals',
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
        console.log('Proxied request to Flask:', proxyReq.path);
    }
}));

app.use('/generate_recipe', createProxyMiddleware({
    target: 'http://localhost:5002/generate_recipe',
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
        console.log('Proxied request to Flask:', proxyReq.path);
    }
}));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});