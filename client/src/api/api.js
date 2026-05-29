async function getCourses(){
    try{
        const response = await fetch('http://localhost:3001/api/courses')

        if (response.ok){
            const courses_list = await response.json();
            return courses_list;
        }
        else{
            throw new Error('HTTP error in getCourses, code=' + response.status)
        }
    }
    catch (err){
        throw new Error("Network error", { cause: err})
    }
}

export { getCourses }