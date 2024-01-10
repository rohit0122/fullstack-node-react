export const buildImageForView = (image, isMale, isGreatGrandPlace) => {
    let imagePath = '/greatGrandPlace.jpeg';
    if(isGreatGrandPlace != 1){
        if(image){
            imagePath = image;
        }else{
            imagePath = isMale ? '/dummyMale.png' : '/dummyFemale.jpeg';
        }
    }
    return imagePath;
}