package com.medtrixhealthcare.MSCM2016;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.JavascriptInterface;
import com.medtrixhealthcare.MSCM2016.R;

@SuppressLint("SdCardPath")
public class JSInterface {
	
	public interface callBacks {
		void SendFileSize(int size);
	}
	
	private callBacks callerActivity;
	private Context jContext = null;
	private Activity jActivity = null;
	
	public JSInterface(Context context, Activity activity) {
		this.jContext = context;
		this.jActivity = activity;
		callerActivity = (callBacks) activity;
	}
	
	@JavascriptInterface
	public void DownloadUpdates(String downloadUrl, String replaceUrl, int size) {
		try {
			// Remove all cookies
			CookieSyncManager.createInstance(this.jContext);
			CookieManager cookieManager = CookieManager.getInstance();
			cookieManager.removeAllCookie();
			
			String sourcePath = downloadUrl.replaceAll("(?<!(http:|https:))//", "/");
			replaceUrl = replaceUrl.replace("\\", "/");
			URL url = new URL(sourcePath);
			URLConnection urlConnection = url.openConnection();
			
			urlConnection.setDoOutput(false);
			urlConnection.setConnectTimeout(1500);
			urlConnection.connect();
			
			InputStream inputStream = new BufferedInputStream(urlConnection.getInputStream());
			String destinationPath = "/data/data/" + jContext.getPackageName() + "/" + replaceUrl;
			
			File directory = new File(destinationPath.substring(0, destinationPath.lastIndexOf("/")));
			if (!(directory.isDirectory()) && (!(directory.exists()))) {
				directory.mkdirs();
			}
			
			FileOutputStream outputStream = new FileOutputStream(destinationPath);
			
			int bytesRead = -1;
			byte[] buffer = new byte[4096];
			while ((bytesRead = inputStream.read(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}
			
			outputStream.close();
			inputStream.close();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		callerActivity.SendFileSize(size);
	}
	
	@JavascriptInterface
	public void LoadApplication() {
		Intent intent = new Intent(jContext, Application.class);
		jActivity.startActivity(intent);
		jActivity.finish();
		jActivity.overridePendingTransition(R.anim.pull_in_right, R.anim.push_out_left);
	}
	
	@JavascriptInterface
	public boolean isOnline() {
		
		Runtime runtime = Runtime.getRuntime();
		try {
			Process ipProcess = runtime.exec("/system/bin/ping -c 1 8.8.8.8");
			int exitValue = ipProcess.waitFor();
			return (exitValue == 0);
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		catch (InterruptedException e) {
			e.printStackTrace();
		}
		return false;
	}
}
