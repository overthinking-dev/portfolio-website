entries.forEach(entry => {
    if (entry.isIntersecting) {
        const picture = entry.target.closest('picture');
        const img = entry.target;
        
        if (picture) {
            // Для picture элементов - обновляем source и img
            const source = picture.querySelector('source');
            if (source) {
                source.srcset = source.srcset;
            }
            img.src = img.dataset.src;
        } else {
            // Для обычных img элементов
            img.src = img.dataset.src;
        }
        
        img.classList.remove('lazy');
        img.classList.add('loaded');
        observer.unobserve(img);
    }
});
