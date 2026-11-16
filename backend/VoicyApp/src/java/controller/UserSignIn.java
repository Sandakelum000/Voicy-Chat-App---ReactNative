/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

@MultipartConfig
@WebServlet(name = "UserSignIn", urlPatterns = {"/UserSignIn"})
public class UserSignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        Gson gson = new Gson();
        responseObject.addProperty("status", Boolean.FALSE);
        
        String countryCode = request.getParameter("countryCode");
        String mobile = request.getParameter("mobileNo");
        String password = request.getParameter("password");
        
        if (countryCode.isEmpty()) {
            responseObject.addProperty("message", "Country code is required");
        }else if (mobile.isEmpty()) {
            responseObject.addProperty("message", "Mobile number is required");
        }else if (password.isEmpty()) {
            responseObject.addProperty("message", "password is required");
        }else{
            Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria c = session.createCriteria(User.class);
            c.add(Restrictions.and(Restrictions.eq("countryCode", countryCode),Restrictions.eq("contactNo", mobile),Restrictions.eq("password", password)));
            User user = (User) c.uniqueResult();
            
            if (user != null) {
                responseObject.addProperty("status", Boolean.TRUE);
                responseObject.addProperty("userId", user.getId());
            }
        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
        
    }
    
    

}
