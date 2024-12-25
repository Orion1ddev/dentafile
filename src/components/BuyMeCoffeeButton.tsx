import { useEffect } from 'react';

const BuyMeCoffeeButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'Dentafile');
    script.setAttribute('data-color', '#5F7FFF');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Lato');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#ffffff');
    script.setAttribute('data-coffee-color', '#FFDD00');
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="fixed bottom-4 right-4" id="buy-me-coffee-container" />;
};

export default BuyMeCoffeeButton;