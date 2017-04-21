package com.omnificence.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import android.app.Activity;
import android.content.res.AssetManager;

public class CopyAssets {
	@SuppressWarnings("unused")
	private Activity cActivity = null;

	public CopyAssets(Activity activity) {
		this.cActivity = activity;
	}

	public boolean copyAssetFolder(AssetManager assetManager, String fromPath, String toPath) {
		try {
			String[] files = assetManager.list(fromPath);
			new File(toPath).mkdirs();
			boolean res = true;
			for (String file : files) {
				if (file.contains("."))
					res &= copyAsset(assetManager, fromPath + "/" + file, toPath + "/" + file);
				else
					res &= copyAssetFolder(assetManager, fromPath + "/" + file, toPath + "/" + file);
			}
			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	private boolean copyAsset(AssetManager assetManager, String fromPath, String toPath) {
		InputStream in = null;
		OutputStream out = null;
		try {
			in = assetManager.open(fromPath);
			new File(toPath).createNewFile();
			out = new FileOutputStream(toPath);
			copyFile(in, out);
			in.close();
			in = null;
			out.flush();
			out.close();
			out = null;
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	private void copyFile(InputStream in, OutputStream out) throws IOException {
		byte[] buffer = new byte[4096];
		int read;
		while ((read = in.read(buffer)) != -1) {
			out.write(buffer, 0, read);
		}
	}
}
