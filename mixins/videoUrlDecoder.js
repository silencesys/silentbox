export default {
    methods: {
        getYoutubeVideoId(url) { 
            let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            let match  = url.match(regExp);

            return (match !== undefined && match[7] !== undefined) ? match[7] : false;
        },
        getVimeoVideoId(url) {
            return /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(url)[3];
        }
    }
}