# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# UNSPLASH API
50 requests per hour for demo app

# Get random Photo
https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY

GET https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY

### params
    count	The number of photos to return. (Default: 1; max: 30)
    query	Limit selection to photos matching a search term
    
    with count param, 
    we'll return an array of object, we are interested in the following:
        created_at,
        description,
        urls.small for the image url, we will get 400 x 400 img,
        links.download


# Search Photos by Keyword
GET /search/photos

https://api.unsplash.com/search/photos/?client_id=YOUR_ACCESS_KEY

### params
    query	Search terms.
    per_page	Number of items per page. (Optional; default: 10)
    page	Page number to retrieve. (Optional; default: 1)
    
    we'll return an object, single, we are interested in the following:
        total_pages,
        results --> is an array of object with images we want
            results.created_at,
            results.description,
            results.links.download,
            results.urls.small,
            


            
