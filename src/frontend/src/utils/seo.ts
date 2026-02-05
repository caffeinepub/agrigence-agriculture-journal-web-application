/**
 * SEO utility functions for setting document title and meta description
 */

export function setDocumentTitle(title: string) {
  document.title = title;
}

export function setMetaDescription(description: string) {
  let metaDescription = document.querySelector('meta[name="description"]');
  
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', description);
}

export function setSEO(title: string, description: string) {
  setDocumentTitle(title);
  setMetaDescription(description);
}
