const allowedExt = ['jpg','jpeg','png'];
const limit = 5*1024*1024;

export  const filelimiter = (req, res , next)=>{
    try {
        
        const {profileImage:{name , size}} = req.files;
        if(!name || !size) return res.status(400).send({code :400 , "message":"Please uplaod a profile image"});
        
        const ext = name.split(".")[1];
        if(!allowedExt.includes(ext)) return res.status(400).send({code :400 , "message":"Please uplaod a .jpeg , .jpg , .png file"})
    
        if(size> limit) return res.status(400).send({code :400 , "message":"Please upload image less than 5mb"})
    
        next()
    } catch (error) {
        return res.status(500).send({code :500 , "message":"Internal Server Error"})
    }
}

