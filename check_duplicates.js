const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    
    const idMap = new Map();
    const contentMap = new Map();
    const duplicates = {
        ids: [],
        content: []
    };

    data.forEach((item, index) => {
        // Check for duplicate IDs
        if (idMap.has(item.question_id)) {
            duplicates.ids.push({
                id: item.question_id,
                indices: [idMap.get(item.question_id), index]
            });
        } else {
            idMap.set(item.question_id, index);
        }

        // Check for duplicate content (question_en)
        // Normalize content: trim and lowercase for better matching
        const normalizedContent = item.question_en ? item.question_en.trim() : '';
        
        if (normalizedContent) {
            if (contentMap.has(normalizedContent)) {
                duplicates.content.push({
                    id: item.question_id,
                    originalId: data[contentMap.get(normalizedContent)].question_id,
                    content: normalizedContent.substring(0, 50) + '...'
                });
            } else {
                contentMap.set(normalizedContent, index);
            }
        }
    });

    console.log('--- Duplicate Check Report ---');
    console.log(`Total items checked: ${data.length}`);
    
    if (duplicates.ids.length > 0) {
        console.log(`\nFound ${duplicates.ids.length} duplicate IDs:`);
        duplicates.ids.forEach(d => {
            console.log(`- ID ${d.id} found at indices ${d.indices.join(', ')}`);
        });
    } else {
        console.log('\nNo duplicate IDs found.');
    }

    if (duplicates.content.length > 0) {
        console.log(`\nFound ${duplicates.content.length} potential duplicate questions (by English content):`);
        duplicates.content.forEach(d => {
            console.log(`- Question ID ${d.id} is a duplicate of ID ${d.originalId}`);
            console.log(`  Content: ${d.content}`);
        });
    } else {
        console.log('\nNo duplicate questions found.');
    }

} catch (err) {
    console.error('Error reading or parsing data.json:', err);
}
