package socket;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

/**
 *
 * @author hiran
 */
public class ProfileService {

    public boolean saveProfileImage(int userId, HttpServletRequest request) throws IOException, ServletException {
        
        Part profileImage = request.getPart("profileImage");
        String appPath = request.getServletContext().getRealPath("");

        String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "profile-images");
        System.out.println(newPath);

        File profileFolder = new File(newPath, String.valueOf(userId));

        if (!profileFolder.exists()) {
            profileFolder.mkdirs();
        }

        File file1 = new File(profileFolder, "profile1.png");
        Files.copy(profileImage.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return true;
    }

    
    public static String getProfileUrl(int userId) {
        try {
            URL url = new URI("http://127.0.0.1:8080/VoicyApp/profile-images/" + userId + "/profile1.png").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("HEAD");
            int responseCode = conn.getResponseCode();
            conn.connect();

            String profile;
            if (responseCode == HttpURLConnection.HTTP_OK) {
                profile = ChatService.URL + "/VoicyApp/profile-images/" + userId + "/profile1.png";
            } else {
                profile = "";
            }
            return profile;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public static String[] saveImage(String base64Image, int userId){
        String[] check = new String[2];
        
        if (base64Image.contains(",")) {
            base64Image = base64Image.split(",")[1];
        }
        
        try {
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            
            String basePath = "/Users/hiran/NetBeansProjects/ReactNative/VoicyApp/web/ImageFile";
            
            File imageFileFolder = new File(basePath,String.valueOf(userId));
            if (!imageFileFolder.exists()) {
                imageFileFolder.mkdirs();
            }
            check[0] = String.valueOf(false);
            check[1] = "";
            File userImageFile = new File(imageFileFolder, "image_" + userId + "_" + System.currentTimeMillis() + ".png");
            
            try(OutputStream stream = new FileOutputStream(userImageFile)){
                stream.write(imageBytes);
                check[0] = String.valueOf(true);
                check[1] = userImageFile.getAbsolutePath().replaceFirst("^.*?/web", "");
            }
            
            System.out.println("Image saved successFully :"+userImageFile.getAbsolutePath());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return check;
    }
}
